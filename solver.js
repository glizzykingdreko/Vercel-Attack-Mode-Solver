const crypto = require('crypto');

// Function to compute the SHA-256 hash of a string.
async function computeSHA256Hash(inputString) {
    // Encode the input string into bytes.
    const encodedInput = new TextEncoder().encode(inputString);
    // Compute the SHA-256 hash of the encoded input.
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedInput);
    // Convert the hash to an array of bytes.
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert each byte to a hexadecimal string and join them to form the full hash.
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Function to find a string that, when appended to a base string and hashed, starts with a specific prefix.
async function findStringWithHashPrefix(baseString, desiredPrefix) {
    while (true) {
        // Generate a random string.
        const randomString = Math.random().toString(36).substring(2, 15);
        // Compute the hash of the base string concatenated with the random string.
        const hash = await computeSHA256Hash(baseString + randomString);
        // Check if the hash starts with the desired prefix.
        if (hash.startsWith(desiredPrefix)) {
            // If it does, return the random string and the hash.
            return { key: randomString, hash: hash };
        }
    }
}

// Function to process a specially formatted string for verification or data retrieval.
async function processFormattedString(formattedString) {
    // Decode the base64-encoded part of the input and split it into components.
    const decodedString = atob(formattedString.split('.')[3]);
    const [component1, baseStringForHash, desiredPrefix, iterations] = decodedString.split(';');
    const resultKeys = [];

    let currentPrefix = desiredPrefix;
    // Repeatedly find strings that produce the desired hash prefix.
    for (let i = 0; i < Number(iterations); i++) {
        const result = await findStringWithHashPrefix(baseStringForHash, currentPrefix);
        resultKeys.push(result.key);
        // Update the prefix based on the last part of the previous hash.
        currentPrefix = result.hash.slice(-currentPrefix.length);
    }

    return resultKeys.join(';');
}


(async () => {
    const result = await processFormattedString(
        "0.1709420117.60.ZGE2MzY1ZDM1MTFkZTFiY2U2NDA3MzQxN2I2MTA3OWY7Mzc3ZmU1ODI7MDAwMDsz.b6f78081d621791ef2ec04d4479bae7c"
    );
    console.log(result);
})()