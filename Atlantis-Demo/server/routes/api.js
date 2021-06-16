const express = require('express');

const mwareController = require('../mwareController.js');

const router = express.Router();

router.get('/',
    mwareController.getCategories,
  (req, res) => res.status(200).json(res.locals.allCategories)
);

router.get('/:id',
    mwareController.getOneCategory,
  (req, res) => res.status(200).json(res.locals.category)
);

router.post('/',
    mwareController.createCategory,
  (req, res) => res.status(200).json(res.locals.newCategory)
);

router.put('/:id',
    mwareController.updateCategory,
  (req, res) => res.status(200).json(res.locals.updatedCategory)
);

router.delete('/:id',
    mwareController.deleteCategory,
  (req, res) => res.status(200).json(res.locals.deletedCategory)
);

// router.get('/wallet',
//   userController.getUser,
//   (req, res) => res.status(200).json(res.locals.user)
// );



// router.post('/walet/:user_categoryId',
//   userController.createUserCategory,
//   (req, res) => res.status(200).json({})
// );

// router.post('/expenses',
//   userController.addExpense,
//   (req, res) => res.status(200).json({})
// );



module.exports = router;
