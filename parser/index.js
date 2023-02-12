import cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

//const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const parsePage = async (url) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const productData = {};

  $(`script[type="application/ld+json"]`).each((i, el) => {
    if ($(el).html().includes(`Product`)) {
      const productJson = JSON.parse($(el).html());

      productData.sku = productJson.sku;
      productData.name = productJson.name;
      productData.url = productJson.url;
      productData.color = productJson.color;
      productData.description = productJson.description;
      productData.lowPrice = productJson.offers.lowPrice;
      productData.highPrice = productJson.offers.highPrice;
      productData.avgPrice =
        productJson.offers.lowPrice + productJson.offers.highPrice / 2;
      productData.images = productJson.image;
    }
  });

  return productData;
};

(async () => {
  const mainPage = process.env.ORIGIN_URL + process.env.PARSE_URL;
  const response = await axios.get(mainPage);
  const $ = cheerio.load(response.data);
  const productLinks = [];

  // Get all product links
  $(".list-item .list-item__title-container a").each((i, element) => {
    productLinks.push(process.env.ORIGIN_URL + $(element).attr("href"));
  });

  const productsData = [];
  // Parse each product page
  for (const link of productLinks) {
    const productData = await parsePage(link);
    productsData.push(productData);
  }

  await axios
    .post("http://localhost:5000/api/products/addToReview", {
      products: productsData,
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));

    console.log("end")
  //console.log(productsData);
})();
