import cheerio from "cheerio";
import got from "got";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.ORIGIN_URL + process.env.PARSE_URL;
const products = [];

const getProducts = async (page) => {
  const local_products = [];
  const page_html = cheerio.load(page);
  const product_list = page_html(".list-body .list-item");

  product_list.each((i, item) => {
    const product_html = cheerio.load(item);

    if (product_html(".list-item__value a").length !== 0) {
      const product_title = product_html(".list-item__title");
      const product_name = product_title.text().replace("\n", "").trim();
      const product_price = parseFloat(
        product_html(".list-item__value .price__value")
          .text()
          .replace(/ /g, "")
          .replace(/ /g, "")
      );
      const product_img =
        process.env.ORIGIN_URL +
        product_html(".list-item__img img").attr("src");
      const product_link = process.env.ORIGIN_URL + product_title.attr("href");

      const product = {
        name: product_name,
        price: product_price,
        img: product_img,
        link: product_link,
      };

      local_products.push(product);
    }
  });

  return local_products;
};

const getPages = async (url) => {
  const { body } = await got(url);
  const $ = cheerio.load(body);
  const pages = $(".list-body .pagination .pagination__pages a")
    .last()
    .attr("href")
    .split("=")[1];
  return pages;
};

const getPage = async (url, page) => {
  const { body } = await got(`${url}/?p=${page}`);
  return body;
};

let pages = await getPages(url);
console.log("Pages: " + pages);
do {
  console.log(url + "?p=" + pages);

  const page = await getPage(url, pages);

  const local_products = await getProducts(page);
  console.log(local_products);
  products.push(...local_products);

  pages--;
} while (pages > 0);

console.log(products);
