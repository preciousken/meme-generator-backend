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
