const Category = require("../models/categorys");
const Category_group = require("../models/category_groups");
const ITEM_PER_PAGE = 10;

const getALLCategoryGroup = async (req, res) => {
    try {
        const categoryGroups = await Category_group.findAll({
            attributes: ["id", "category_group_title"],
        });
        res.send(categoryGroups);
    } catch (error) {
        console.log(error);
    }
};

const getCategoryClient = async (req, res) => {
    try {
        const categorys = await Category_group.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: "category_group_client",
                },
            ],
        });
        res.send({
            data: categorys.rows,
        });
    } catch (error) {
        console.log(error);
    }
};

const getAllCategory = async (req, res) => {
    const { page, sortBy, orderBy } = req.query;
    if (page) {
        const offset = (page - 1) * ITEM_PER_PAGE;
        try {
            const categorys = await Category.findAndCountAll({
                attributes: ["id", "fk_category_group_id", "category_title"],
                include: [
                    {
                        model: Category_group,
                        as: "category_group",
                    },
                ],
                offset: offset,
                limit: ITEM_PER_PAGE,
                order: [[sortBy || "id", orderBy || "DESC"]],
            });
            const totalPage = await Math.ceil(categorys.count / ITEM_PER_PAGE);
            res.send({
                totalPage: totalPage,
                data: categorys.rows,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const categorys = await Category.findAndCountAll({
                attributes: ["id", "fk_category_group_id", "category_title"],
                include: [
                    {
                        model: Category_group,
                        as: "category_group",
                    },
                ],
                //order: [["fk_category_group_id", "ASC"]],
                order: [[sortBy || "id", orderBy || "DESC"]],
            });
            const totalPage = await Math.ceil(categorys.count / ITEM_PER_PAGE);
            res.send({
                totalPage: totalPage,
                data: categorys.rows,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const createCategory = async (req, res) => {
    const { categoryTitle, categoryGroupId } = req.body;
    try {
        await Category.create({
            fk_category_group_id: categoryGroupId,
            category_title: categoryTitle,
        });

        res.send({
            message: "Add category success",
            action: "add",
        });
    } catch (error) {
        console.log(error);
    }
};

const updateCategory = async (req, res) => {
    const { categoryTitle, categoryGroupId } = req.body;
    const id = req.params.id;
    try {
        await Category.update(
            {
                fk_category_group_id: categoryGroupId,
                category_title: categoryTitle,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send({
            message: "Update category success",
            action: "update",
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.destroy({
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
    getALLCategoryGroup,
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryClient,
};
