import ExifParser from 'exif-parser';

/**
 * Gatekeeper Middleware: verifyEXIF
 * Inspects uploaded images and documents for metadata integrity, camera provenance,
 * creation timestamps, and post-processing software flags (e.g. Photoshop/Canva).
 */
export const verifyEXIF = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    req.exifAnalysis = [];

    for (const file of files) {
      const analysis = {
        filename: file.originalname || 'unknown',
        mimeType: file.mimetype || 'application/octet-stream',
        size: file.size || 0,
        hasExif: false,
        cameraMake: 'Unknown / Not Provided',
        cameraModel: 'Unknown Device',
        dateTimeOriginal: null,
        software: null,
        integrityStatus: 'OK',
        warnings: []
      };

      // Guard against missing, empty, or non-buffer data
      if (!file.buffer || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
        analysis.integrityStatus = 'TAMPERED';
        analysis.warnings.push('Zero-byte or corrupted file payload received.');
        req.exifAnalysis.push(analysis);
        continue;
      }

      // Only attempt EXIF extraction for image/jpeg or image/tiff formats
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/tiff') {
        try {
          const parser = ExifParser.create(file.buffer);
          const result = parser.parse();

          if (result && result.tags) {
            analysis.hasExif = true;
            const tags = result.tags;

            analysis.cameraMake = tags.Make || tags.make || 'Standard Sensor';
            analysis.cameraModel = tags.Model || tags.model || 'Generic Capture Device';
            analysis.software = tags.Software || null;

            if (tags.DateTimeOriginal || tags.CreateDate) {
              const epoch = tags.DateTimeOriginal || tags.CreateDate;
              analysis.dateTimeOriginal = new Date(epoch * 1000).toISOString();
            }

            // Flag suspicious photo editing software
            const forbiddenSoftware = ['photoshop', 'gimp', 'canva', 'paint.net', 'lightroom'];
            if (analysis.software) {
              const softLower = analysis.software.toLowerCase();
              if (forbiddenSoftware.some(sw => softLower.includes(sw))) {
                analysis.warnings.push(`Image altered using photo editing suite: ${analysis.software}`);
                analysis.integrityStatus = 'TAMPERED';
              }
            }

            // Flag metadata stripped or spoofed dates
            if (analysis.dateTimeOriginal) {
              const photoDate = new Date(analysis.dateTimeOriginal);
              const now = new Date();
              if (photoDate > now) {
                analysis.warnings.push('Metadata timestamp is set in the future.');
                analysis.integrityStatus = 'TAMPERED';
              }
            }
          }
        } catch (exifErr) {
          // File may lack EXIF headers or have corrupted header markers
          analysis.hasExif = false;
          analysis.warnings.push(`EXIF headers missing or unparseable (${exifErr.message}).`);
        }
      } else if (file.mimetype && file.mimetype.startsWith('image/')) {
        // PNG or WebP images generally do not carry standard EXIF unless converted
        analysis.hasExif = false;
        analysis.warnings.push(`File format ${file.mimetype} lacks hardware camera EXIF signature.`);
      } else {
        // Documents (PDF, TXT, DOCX)
        analysis.hasExif = false;
        analysis.cameraMake = 'Document Artifact';
      }

      req.exifAnalysis.push(analysis);
    }

    next();
  } catch (err) {
    console.error('[verifyEXIF] Gatekeeper error:', err);
    // Ensure every file in files array receives an analysis object matching its index
    const files = req.files || (req.file ? [req.file] : []);
    req.exifAnalysis = (files.length > 0 ? files : [{ originalname: 'unknown' }]).map(f => ({
      filename: f.originalname || 'unknown',
      hasExif: false,
      integrityStatus: 'ERROR',
      warnings: [`EXIF parser system failure: ${err.message}`]
    }));
    next();
  }
};
