const Sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");
const Category = require("../models/categorys");
const Product = require("../models/products");
const Product_image = require("../models/product_images");
const { Op } = require("sequelize");

//Product atribulte
const atributeProduct = [
    "id",
    "product_code",
    "product_name",
    "product_price",
    "product_sex",
    "fk_category_status_id",
    "fk_category_style_id",
    "fk_category_line_id",
    "fk_category_collection_id",
    "fk_category_material_id",
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

//Add priority for image
const addPriority = (imageArray, imagePriority) => {
    const newArrayImg = imageArray.map((item, index) => {
        if (index === +imagePriority.image1) {
            return {
                ...item,
                priority: 2,
            };
        } else if (index === +imagePriority.image2) {
            return {
                ...item,
                priority: 1,
            };
        } else {
            return {
                ...item,
                priority: 0,
            };
        }
    });
    return newArrayImg;
};

//Filter category title
const filterCategoryTitle = async (products) => {
    let categorys;
    try {
        categorys = await Category.findAll({
            attributes: ["id", "category_title"],
        });
    } catch (error) {
        console.log(error);
    }

    const newCategoryProduct = products.map((product) => {
        let categoryTitle = {};
        categorys.map((category) => {
            if (product.fk_category_status_id === category.id) {
                categoryTitle.status_title = category.category_title;
            }

            if (product.fk_category_style_id === category.id) {
                categoryTitle.style_title = category.category_title;
            }

            if (product.fk_category_line_id === category.id) {
                categoryTitle.line_title = category.category_title;
            }

            if (product.fk_category_collection_id === category.id) {
                categoryTitle.collection_title = category.category_title;
            }

            if (product.fk_category_material_id === category.id) {
                categoryTitle.material_title = category.category_title;
            }
        });

        //Sort data
        const categoryTitleSortKey = Object.keys(categoryTitle)
            .sort()
            .reduce((obj, key) => {
                obj[key] = categoryTitle[key];
                return obj;
            }, {});

        const {
            fk_category_status_id,
            fk_category_style_id,
            //fk_category_line_id,
            fk_category_collection_id,
            fk_category_material_id,
            ...filterValue
        } = product.dataValues;
        return {
            ...filterValue,
            categorys_title: categoryTitleSortKey,
        };
    });
    return newCategoryProduct;
};

//Get all product
const getAllProduct = async (req, res) => {
    const { page, sortBy, orderBy, limit = 7 } = req.query;
    let offSet = (page - 1) * limit;

    try {
        //Only count for include model
        let products = await Product.findAndCountAll({
            attributes: [...atributeProduct],

            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            include: [
                {
                    model: Product_image,
                    as: "product_images",
                    limit: page ? 20 : 2,
                    order: [["priority", "DESC"]],
                },
            ],
            order: [[sortBy || "id", orderBy || "DESC"]],
        });

        let rowCount = await Product.count();

        const totalPage = await Math.ceil(rowCount / limit);
        if (page) {
            res.send({
                totalPage: totalPage,
                data: products.rows,
            });
        } else {
            const newCategoryProduct = await filterCategoryTitle(products.rows);
            res.send(newCategoryProduct);
        }
    } catch (error) {
        console.log(error);
    }
};

//Filter product from client
const filterProduct = async (req, res) => {
    const { limit, offset } = req.query;
    try {
        const product = await Product.findAll({
            where: {
                [Op.and]: {
                    fk_category_status_id: {
                        [Op.or]: req.body?.statusId,
                    },
                    fk_category_style_id: {
                        [Op.or]: req.body?.styleId,
                    },

                    fk_category_line_id: {
                        [Op.or]: req.body?.lineId,
                    },
                    fk_category_collection_id: {
                        [Op.or]: req.body?.collectionId,
                    },
                    fk_category_material_id: {
                        [Op.or]: req.body?.materialId,
                    },
                    product_price: {
                        [Op.between]: [
                            req.body.priceRange[0]?.from || 0,
                            req.body.priceRange[req.body.priceRange.length - 1]
                                ?.to || 1000000000,
                        ],
                    },
                    product_sex: {
                        [Op.or]: req.body?.gender ? [req.body.gender] : [],
                    },
                },
            },
            attributes: [...atributeProduct],
            include: [
                {
                    model: Product_image,
                    as: "product_images",
                    limit: 2,
                    attributes: ["id", "image", "priority"],
                    order: [["priority", "DESC"]],
                },
            ],
            offset: +offset || 0,
            limit: +limit || 8,
        });

        const productCategory = await filterCategoryTitle(product);
        res.send(productCategory);
    } catch (error) {
        console.log(error);
    }
};

//Find product
const findProduct = async (req, res) => {
    let categorys;
    const { search, limit } = req.query;

    try {
        const product = await Category.findAll({
            where: {
                [Op.or]: [
                    {
                        category_title: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$products.product_name$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$products.product_price$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
            include: [
                {
                    model: Product,
                    as: "products",
                    include: [
                        {
                            model: Product_image,
                            as: "product_images",
                            limit: 2,
                            attributes: ["id", "image", "priority"],
                            order: [["priority", "DESC"]],
                        },
                    ],
                },
            ],
        });
        const productFind = product.map((item) => {
            return item.products;
        });
        //Flat: loai bo mang nam trong mang
        const productCategory = await filterCategoryTitle(
            productFind.flat(),
            categorys
        );
        res.send(productCategory);
    } catch (error) {
        console.log(error);
    }
};

//Get one product
const getOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where: {
                id: id,
            },
            attributes: [...atributeProduct],
            include: [
                {
                    model: Product_image,
                    as: "product_images",
                    limit: 20,
                    attributes: ["id", "image", "priority"],
                    order: [["priority", "DESC"]],
                },
            ],
        });
        const productCategory = await filterCategoryTitle([product]);
        res.send(productCategory);
    } catch (error) {
        console.log(error);
    }
};

//Create product
const upload = multer({ storage: storage }).array("productImages", 12);
const createProduct = async (req, res) => {
    upload(req, res, async function () {
        // if (err instanceof multer.MulterError) {
        //   // Một lỗi của Multer xảy ra khi upload.
        // } else if (err) {
        //   // Một lỗi không xác định xảy ra khi upload.
        // } else {
        // }
        const imageArray = req.files;
        const {
            productName,
            productPrice,
            productSex,
            categoryStatusId,
            categoryStyleId,
            categoryLineId,
            categoryCollectionId,
            categoryMaterialId,
        } = req.body;

        const imagePriority = JSON.parse(req.body.imagePriority);

        try {
            await Product.create({
                product_code: "",
                product_name: productName,
                product_price: productPrice,
                product_sex: productSex,
                fk_category_status_id: categoryStatusId,
                fk_category_style_id: categoryStyleId,
                fk_category_line_id: categoryLineId,
                fk_category_collection_id: categoryCollectionId,
                fk_category_material_id: categoryMaterialId,
            });
        } catch (error) {
            console.log(error);
        }

        let productId;
        try {
            productId = await Product.findOne({
                attributes: ["id"],
                order: [["id", "DESC"]],
            });
        } catch (error) {
            console.log(error);
        }

        const newArrayImg = imageArray.map((item, index) => ({
            fk_product_id: productId.id,
            image: item.filename,
        }));

        const newArrayImgPrioriry = addPriority(newArrayImg, imagePriority);

        try {
            await Product_image.bulkCreate(newArrayImgPrioriry);
            res.send({
                message: "Add product success",
                action: "add",
            });
        } catch (error) {
            console.log(error);
        }
    });
};

//Update product
const updateProduct = async (req, res) => {
    upload(req, res, async function () {
        const { id } = req.params;
        const {
            productName,
            productPrice,
            productSex,
            categoryStatusId,
            categoryStyleId,
            categoryLineId,
            categoryCollectionId,
            categoryMaterialId,
        } = req.body;

        const imagePriority = JSON.parse(req.body.imagePriority);

        const imageFilesArray = req.files;
        const imageFilesArr = imageFilesArray.map((item) => ({
            fk_product_id: id,
            image: item.filename,
        }));
        const imageArray = JSON.parse(req.body.images);

        const imagesArr = imageArray.map((item) => ({
            fk_product_id: id,
            image: item.image,
        }));
        const newArrayImg = [...imagesArr, ...imageFilesArr];

        const newArrayImgPrioriry = addPriority(newArrayImg, imagePriority);

        try {
            await Product.update(
                {
                    product_name: productName,
                    product_price: productPrice,
                    product_sex: productSex,
                    fk_category_status_id: categoryStatusId,
                    fk_category_style_id: categoryStyleId,
                    fk_category_line_id: categoryLineId,
                    fk_category_collection_id: categoryCollectionId,
                    fk_category_material_id: categoryMaterialId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }

        try {
            await Product_image.destroy({
                where: {
                    fk_product_id: id,
                },
            });
        } catch (error) {
            console.log(error);
        }

        try {
            await Product_image.bulkCreate(newArrayImgPrioriry);
            res.send({
                message: "Update category success",
                action: "update",
            });
        } catch (error) {
            console.log(error);
        }
    });
};

//Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.destroy({
            where: {
                id: id,
            },
        });
        res.send({
            message: "Delete category success",
            action: "delete",
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createProduct,
    getAllProduct,
    deleteProduct,
    updateProduct,
    getOneProduct,
    filterProduct,
    findProduct,
};
