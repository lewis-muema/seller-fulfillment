/* eslint-disable no-undef */
let s3 = "";

const upload = {
  methods: {
    uploadImg(id) {
      this.productUploadStatus = true;
      const files = document.getElementById(id)["files"];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert("Please select image");
      }
      const file = files[0];
      const fileType = files[0]["type"];
      const fileName = this.sanitizeFilename(file.name);
      this.fileName = fileName;
      const albumPhotosKey = `${encodeURIComponent("fulfillment_products")}/`;
      const photoKey = albumPhotosKey + fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: "public-read",
          ContentType: fileType,
        },
        // eslint-disable-next-line no-unused-vars
        (err, data) => {
          if (err) {
            console.log(
              "There was an error uploading your photo: ",
              err.message
            );
          } else {
            this.image = data.Location;
            this.productUploadStatus = false;
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    uploadPDF(id) {
      this.PDFUploadStatus = true;
      const files = document.getElementById(id)["files"];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert("Please select image");
      }
      const file = files[0];
      const fileType = files[0]["type"];
      const fileName = this.sanitizeFilename(file.name);
      this.fileName = fileName;
      const albumPhotosKey = `${encodeURIComponent(
        "fulfillment_delivery_docs"
      )}/`;
      const photoKey = albumPhotosKey + fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: "public-read",
          ContentType: fileType,
        },
        // eslint-disable-next-line no-unused-vars
        (err, data) => {
          if (err) {
            console.log(
              "There was an error uploading your photo: ",
              err.message
            );
          } else {
            this.PDF = data.Location;
            this.PDFUploadStatus = false;
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    sanitizeFilename(name) {
      const temp_name = `B-000-1111_${new Date().getTime()}.${name
        .split(".")
        .pop()}`;
      return temp_name;
    },
    initiateS3() {
      const script = document.createElement("script");
      script.onload = () => {
        const albumBucketName = "sendy-partner-docs";
        const bucketRegion = "eu-west-1";
        const IdentityPoolId = "eu-west-1:2812c134-0c22-4755-be2d-8fa850a041ee";

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId,
          }),
        });

        s3 = new AWS.S3({
          apiVersion: "2006-03-01",
          params: { Bucket: albumBucketName },
        });
      };
      script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.7.20.min.js";

      document.head.appendChild(script);
    },
  },
};
export default upload;
