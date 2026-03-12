export default async function handler(req, res) {

    const { bucketName } = req.query;

    if (!bucketName) {
        return res.status(400).json({ text: "⚠️ Bucket name missing" });
    }

    const urls = [
        { dc: "Local Zoho", url: `https://${bucketName}.lzstratus.com/example.txt` },
        { dc: "US", url: `https://${bucketName}.zohostratus.com/example.txt` },
        { dc: "IN", url: `https://${bucketName}.zohostratus.in/example.txt` },
        { dc: "EU", url: `https://${bucketName}.zohostratus.eu/example.txt` },
        { dc: "JP", url: `https://${bucketName}.zohostratus.jp/example.txt` },
        { dc: "CN", url: `https://${bucketName}.zohostratus.com.cn/example.txt` },
        { dc: "AU", url: `https://${bucketName}.zohostratus.com.au/example.txt` },
        { dc: "CA", url: `https://${bucketName}.zohostratus.ca/example.txt` },
        { dc: "UK", url: `https://${bucketName}.zohostratus.uk/example.txt` },
        { dc: "SA", url: `https://${bucketName}.zohostratus.sa/example.txt` },
        { dc: "SG", url: `https://${bucketName}.zohostratus.sg/example.txt` },
        { dc: "AE", url: `https://${bucketName}.zohostratus.ae/example.txt` }
    ];

    try {

        const promises = urls.map(async (item) => {
            try {
                const r = await fetch(item.url);
                const body = await r.text();

                if (!body.includes("bucket_not_found")) {
                    return `🔹 ${item.dc} : Bucket Exists`;
                }

                return null;
            } catch {
                return null;
            }
        });

        const results = (await Promise.all(promises)).filter(Boolean);

        let msg;

        if (results.length === 0) {
            msg = `🪣 Bucket : ${bucketName}
✅ Status : AVAILABLE`;
        } else {
            msg = `🪣 Bucket : ${bucketName}
🚨 Status : TAKEN

${results.join("\n")}`;
        }

        res.status(200).json({ text: msg });

    } catch (e) {
        res.status(500).json({ text: e.message });
    }
}