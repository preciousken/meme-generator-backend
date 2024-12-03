import fs from 'fs';
import path from 'path';

export function getBase64SizeInMB(base64String) {
    let padding, inBytes, base64StringLength;
    if (base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    inBytes = (base64StringLength / 4) * 3 - padding;
    const sizeInMB = inBytes / (1024 * 1024);
    return sizeInMB;
}

export function saveBase64Image(base64String, outputPath) {
    // Extract the base64 data from the string
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const filePath = path.join(outputPath, `image_${Date.now()}.png`);

    // Save the image to the server
    fs.writeFileSync(filePath, imageBuffer);

    // Return the server URL path
    return `/uploads/${path.basename(filePath)}`;
}

export function isValidUrl(url) {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-zA-Z\\d_]*)?$', 'i' // fragment locator
    );
    return !!urlPattern.test(url);
}
