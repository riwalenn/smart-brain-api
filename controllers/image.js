const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key YOUR_API_KEY");

const handleApiCall = (req, res) => {
    console.log(req.body)
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "FACE_DETECT_MODEL_ID",
            user_app_id: {
                user_id: "YOUR_USER_ID",
                app_id: "YOUR_APP_ID"
            },
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            res.json(response);
        }
    );
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => {
            console.error(err);
            return res.status(404).json('unable to get entries');
        });
}

module.exports = {
    handleApiCall: handleApiCall,
    handleImage: handleImage
}