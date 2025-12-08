const productService = require('../../services/productService');
const Product = require('../../models/Product');

jest.mock('../../models/Product');

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 200 }
      ];
      Product.find.mockResolvedValue(mockProducts);

      const result = await productService.findAll();

      expect(result).toEqual(mockProducts);
      expect(Product.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const mockProduct = { _id: '123', name: 'Product 1', price: 100 };
      Product.findById.mockResolvedValue(mockProduct);

      const result = await productService.findById('123');

      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = { name: 'New Product', price: 150 };
      const mockProduct = { _id: '123', ...productData };
      Product.create.mockResolvedValue(mockProduct);

      const result = await productService.create(productData);

      expect(result).toEqual(mockProduct);
      expect(Product.create).toHaveBeenCalledWith(productData);
    });
  });
});
