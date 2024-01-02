const { exec } = require('child_process');
const screenshot = require('screenshot-desktop')

module.exports = {
    openRemote: async function (req, res, next) {
        try {
            if (req.query.token != 'thaonk') {
                res.send({ 'status': 404 });
                return;
            }

            exec('C:\\"Program Files (x86)"\\UltraViewer\\UltraViewer_Desktop.exe', (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    res.status(400).json({
                        error: {
                            message: error.message
                        }
                    })
                    return;
                }

                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    res.status(400).json({
                        error: {
                            message: 'stderr'
                        }
                    })
                    return;
                }

                resulft = {'message': 'oke'}
                res.json(resulft);
            });


        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
    capture: async function (req, res, next) {
        try {
            if (req.query.token != 'thaonk') {
                res.send({ 'status': 404 });
                return;
            }
            screenshot({ format: 'png' }).then((img) => {
                res.setHeader('Content-Type', 'image/png');
                res.send(img);
            }).catch((err) => {
                res.send({ 'status': 404, err: String(err) });
            })
        } catch (error) {
            res.status(400).json({
                error: {
                    message: error.message
                }
            })
        }
    },
}