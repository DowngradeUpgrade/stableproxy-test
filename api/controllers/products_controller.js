import ProductsModel from "../models/products_model.js";

class ProductsController {
  async transferToMain(req, res, next) {
    try {
      const { products } = req.body;
      const productsData = await ProductsModel.transgerProductsToMain(products);
      res.json(productsData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async addToReview(req, res, next) {
    try {
      const { products } = req.body;
      const productsData = await ProductsModel.addProductsToReview(products);
      res.json(productsData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      const productsData = await ProductsModel.getAllProducts(page, limit);
      res.json(productsData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getForReview(req, res, next) {
    try {
      const productsData = await ProductsModel.getReviewProducts();
      res.json(productsData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async deleteFromReview(req, res, next) {
    try {
      const { products } = req.body;
      const productsData = await ProductsModel.deleteProductsFromReview(
        products
      );
      res.json(productsData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default new ProductsController();
