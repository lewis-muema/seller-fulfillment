/* eslint-disable no-undef */
import { mapGetters, mapMutations } from "vuex";
import { ElNotification } from "element-plus";

let s3 = "";
let s3Autofill = "";
let uploadtimer;
const chunkSize = 20;
const percentCap = 75;
const fullResponse = [];
let percent = 0;

const upload = {
  computed: {
    ...mapGetters([
      "getAutofillDetails",
      "getAutoFillVariants",
      "getBusinessDetails",
      "getUserDetails",
    ]),
  },
  methods: {
    ...mapMutations([
      "setAutofillDetails",
      "setAutoFillVariants",
      "setLPOUploadError",
    ]),
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
    uploadLPO(id) {
      this.LPOUploadStatus = true;
      const files = document.getElementById(id)["files"];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert("Please select image");
      }
      const file = files[0];
      const fileType = files[0]["type"];
      const fileName = this.sanitizeFilename(file.name);
      this.LPOFileName = file.name;
      this.fileName = fileName;
      const albumPhotosKey = `${encodeURIComponent("sample")}/`;
      const photoKey = albumPhotosKey + fileName;
      let val = 0;
      uploadtimer = setInterval(() => {
        if (val < percentCap) {
          val += 1;
          this.uploadPercentage = val;
        }
      }, 500);
      s3Autofill.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: "public-read",
          ContentType: fileType,
        },
        // eslint-disable-next-line no-unused-vars
        (err, data) => {
          if (err) {
            clearInterval(uploadtimer);
            this.LPOUploadStatus = false;
            ElNotification({
              title: this.$t("inventory.couldNotUploadDocument"),
              message: err.message,
              type: "error",
            });
          } else {
            this.LPO = data.Location;
            this.fetchAutofillDetails(photoKey);
          }
        }
      );
    },
    fetchAutofillDetails(photoKey) {
      const payload = {
        invoice_location: photoKey,
        seller_name: this.getBusinessDetails?.business_name,
        seller_id: this.getBusinessDetails?.business_id,
        user_name: `${this.getUserDetails?.first_name} ${this.getUserDetails?.last_name}`,
        user_id: this.getUserDetails?.user_id,
        client_app: "Fulfilment Web Seller App",
      };
      this.requestAxiosPost({
        app: process.env.RND_ORDER_PLACEMENT,
        endpoint: `process_invoice`,
        values: payload,
      }).then((response) => {
        if (response.status === 200) {
          this.setLPOUploadError("");
          this.setAutofillDetails(response.data.deliveries);
          if (response.data.deliveries.products.length) {
            this.fetchAutofillProductsBruteForce(
              this.getDestinationIndex,
              photoKey
            );
          } else {
            clearInterval(uploadtimer);
            this.uploadPercentage = 100;
            this.autoFillFormDetails(this.getDestinationIndex, [], photoKey);
            ElNotification({
              title: this.$t("inventory.couldNotReadProducts"),
              message: "",
              type: "warning",
            });
          }
          if (
            response.data.status === 400 &&
            this.emptyUploadStatus(response)
          ) {
            this.failUpload();
          }
        } else {
          this.failUpload();
        }
      });
    },
    emptyUploadStatus(response) {
      const data = response?.data?.deliveries;
      if (
        data?.products?.length ||
        data?.destination?.name ||
        data?.destination?.phone_number ||
        data?.destination?.house_location ||
        data?.destination?.delivery_instructions ||
        data?.destination?.delivery_location?.description
      ) {
        return false;
      }
      return true;
    },
    divideArray(arr) {
      var result = [];
      var len = arr.length;
      for (var i = 0; i < len; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
      }
      return result;
    },
    fetchAutofillProductsBruteForce(x, photoKey) {
      if (this.getAutofillDetails.products.length > chunkSize) {
        const chunks = this.divideArray(this.getAutofillDetails.products);
        chunks.forEach((products) => {
          products.forEach((row) => {
            row.universal_product_code = row.UPC;
            delete row.UPC;
          });
        });
        this.fetchAutofillProductsChunks(0, chunks, x, photoKey);
      } else {
        this.fetchAutofillProducts(x, photoKey);
      }
    },
    fetchAutofillProductsChunks(index, chunks, x, photoKey) {
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/bulk-create-product-variants`,
        values: { products: chunks[index] },
      }).then((response) => {
        if (response.status === 200) {
          percent = percent + (99 - percentCap) / chunks.length;
          this.uploadPercentage = Math.floor(percent + percentCap);
          fullResponse.push(...response.data.products);
          if (chunks[index + 1]) {
            this.fetchAutofillProductsChunks(index + 1, chunks, x, photoKey);
          } else {
            const res = {
              data: { products: fullResponse },
            };
            this.processAutofillResponse(res, x, photoKey);
          }
        } else {
          this.fetchAutofillProductsChunks(index, chunks, x, photoKey);
        }
      });
    },
    fetchAutofillProducts(x, photoKey) {
      this.getAutofillDetails.products.forEach((row) => {
        row.universal_product_code = row.UPC;
        delete row.UPC;
      });
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/products/bulk-create-product-variants`,
        values: { products: this.getAutofillDetails.products },
      })
        .then((response) => {
          if (response.status === 200) {
            this.processAutofillResponse(response, x, photoKey);
          } else {
            clearInterval(uploadtimer);
            this.uploadPercentage = 100;
            this.autoFillFormDetails(x, [], photoKey);
            ElNotification({
              title: this.$t("inventory.couldNotReadProducts"),
              message: "",
              type: "warning",
            });
          }
        })
        .catch(() => {});
    },
    processAutofillResponse(response, x, photoKey) {
      this.setLPOUploadError("");
      clearInterval(uploadtimer);
      this.uploadPercentage = 100;
      const products = response.data.products;
      const finalProducts = [];
      this.getAutofillDetails.products.forEach((variants) => {
        products.forEach((product) => {
          product.product_variants.filter((row) => {
            const condition =
              row.universal_product_code === variants.universal_product_code &&
              row.product_variant_description === variants.description;
            if (condition && product.product_variants.length > 1) {
              row.quantity = variants.quantity;
              const altProduct = Object.assign({}, product);
              altProduct.selectedOption = row;
              altProduct.quantity = variants.quantity;
              finalProducts.push(altProduct);
            } else if (condition && product.product_variants.length === 1) {
              product.quantity = variants.quantity;
              finalProducts.push(product);
            }
            return condition;
          });
        });
      });
      this.autoFillFormDetails(x, finalProducts, photoKey);
    },
    failUpload() {
      clearInterval(uploadtimer);
      this.setLPOUploadError(this.$t("inventory.weCouldntUseThisFile"));
      this.overlayStatusSet(false, "uploadLPO");
      this.LPOUploadStatus = false;
      ElNotification({
        title: this.$t("inventory.couldNotUploadDocument"),
        message: "",
        type: "error",
      });
    },
    autoFillFormDetails(x, finalProducts, photoKey) {
      const destinationDetails = this.getAutofillDetails?.destination;
      const destinationPayload = {
        expanded: 1,
        preferences: false,
        POD: {
          amountToBeCollected: "none",
        },
        delivery_info: {
          location: destinationDetails?.delivery_location.description,
          apartmentName: destinationDetails?.house_location,
          instructions: destinationDetails?.delivery_instructions,
        },
        recipient: {
          customer_name: destinationDetails?.name,
          phone: destinationDetails?.phone_number,
          secondary_phone_number: "",
          recipient_type: destinationDetails?.buyer_type,
        },
        autofillReviewStatus: true,
        autofillProductStatus: true,
        documents: [
          {
            title: "",
            type: "Local Purchase Order",
            url: `https://sendy-rnd-textextract.s3-eu-west-1.amazonaws.com/${photoKey}`,
          },
        ],
      };
      if (finalProducts.length) {
        destinationPayload.products = finalProducts;
      }
      this.destinations.splice(x, 1, destinationPayload);
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
        const autofillAlbumBucketName = "sendy-rnd-textextract";
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
        s3Autofill = new AWS.S3({
          apiVersion: "2006-03-01",
          params: { Bucket: autofillAlbumBucketName },
        });
      };
      script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.7.20.min.js";

      document.head.appendChild(script);
    },
  },
};
export default upload;
