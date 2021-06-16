const db = require('./models.js')

const mwareController = {}


//  [√]  get category middleware working 
mwareController.getCategories = async (req, res, next) => {
  // write code here
  //console.log('inside getCat')
  try {
  
    const category = ` SELECT category_id, cat_name, target_budget, current_bal, cat_type FROM public."Category"`
    const result = await db.query(category);    
    res.locals.allCategories = result.rows
    //console.log(res.locals.allCategories);
    next();
  } catch (err) {
    console.log('getCategories', err);
  }
  
}

mwareController.getOneCategory = async (req, res, next) => {
  // write code here
  try {
    const uniq_category = req.params.id
    console.log("params.id",uniq_category)
  
    const category = `SELECT * FROM public."Category" WHERE category_id=$1`
    const result = await db.query(category,[uniq_category]);    
    res.locals.category = result.rows[0]
    console.log(res.locals.category);
    next();
  } catch (err) {
    console.log('getOneCategory', err);
  }
  
}


mwareController.createCategory = async (req, res, next) => {
  // write code here
  try {
    const user_category = req.body
    
    console.log("req.body", user_category)
  
    const category = `INSERT INTO public."Category"(
      cat_name, target_budget, current_bal, cat_type) VALUES ( $1, $2, $3, $4) returning *;`
    const result = await db.query(category,[user_category.cat_name, user_category.target_budget, user_category.current_bal, user_category.cat_type]);    
    res.locals.newCategory = result.rows[0]
    console.log(res.locals.newCategory);
    next();
  } catch (err) {
    console.log('createCategory', err);
  }
  
}

mwareController.updateCategory = async (req, res, next) => {
  // write code here
  try {
    const catID = req.params.id
    const catBody = req.body

    console.log("params.id", catID)
  
    const category = `UPDATE public."Category"
    SET category_id=$1, cat_name=$2, target_budget=$3, current_bal=$4, cat_type=$5
    WHERE category_id=$2 returning *`
    const result = await db.query(category,[catBody.category_id, catBody.cat_name, catBody.target_budget, catBody.current_bal, catBody.cat_type, catID]);    
    res.locals.updatedCategory = result.rows[0]
    console.log(res.locals.updatedCategory);
    next();
  } catch (err) {
    console.log('updateCategory', err);
  }
  
}

mwareController.deleteCategory = async (req, res, next) => {
  // write code here
  try {
    const catID = req.params.id
    console.log("params.id", catID)
  
    const category = `DELETE FROM public."Category" WHERE category_id =$1 returning *`
    const result = await db.query(category,[catID]);    
    res.locals.deletedCategory = result.rows[0]
    console.log(res.locals.deletedCategory);
    next();
  } catch (err) {
    console.log('updateCategory', err);
  }
  
}



  // mwareController.createUserCategory = async (req, res, next) => {
  
  //   try {
  //     //declare variable to SQL query
  //   const category =  ` SELECT  * FROM wallet.User JOIN wallet.Category ON wallet.User.id = wallet.Category.id`
  //   const result = await db.query(category)
  //     res.locals.categories = result;
  //     //console.log('This is from get to category');
  //     //console.log(res.locals.categories);
  //     return next();
  //   } catch (error) {
  //      next(error);
  //   }
  // };

  // mwareController.createExpense = async (req, res, next) => {
  
  //   try {
  //     //declare variable to SQL query
  //   const category =  ` INSERT INTO wallet."Expense"(
  //     expense_id, expense_name, category_id, created_on)
  //     VALUES (, "gas & electric",'1', '')`
  //   const result = await db.query(category)
  //     res.locals.categories = result;
  //     //console.log('This is from get to category');
  //     //console.log(res.locals.categories);
  //     return next();
  //   } catch (error) {
  //      next(error);
  //   }
  // };
  
//   mwareController.createUser = (req, res, next) => {

//     //declare variable to SQL query
//     const user = ` INSERT INTO wallet.User (name, username, password, email, budget)
//               VALUES  ('steve', 'steveneven', 'password', 'steven@gmail.com', 5000 )`
//     db.query(category)
//     .then((data) => {
//       res.locals.user = data;
//       //console.log('This is from characters');
//       //console.log(res.locals.characters);
//       next();
//     }).catch((error) => {
//       return next(error);
//     });
//   };


// mwareController.createGitHubUser = (req, res, next) => {
  
//     //declare variable to SQL query
//   try{
//       const user = res.locals.githubId
//       return next()
//     }
//    catch{
//      (error) => {
//       return next(error);
//       }
//     }
//   };

  

//   mwareController.findUser = (req, res, next) => {
  
//     //declare variable to SQL query
//     const user =  `SELECT * FROM wallet."Category";`
//     db.query(category)
//     .then((data) => {
//       res.locals.user = data;
//       //console.log('This is from characters');
//       //console.log(res.locals.characters);
//       next();
//     }).catch((error) => {
//       return next(error);
//     });
//   };


  
// mwareController.addExpense = (req, res, next) => {
// // write code here
// try {
//     const {
//     name,
//     cost
//     } = req.body;
//     const text =
//       "INSERT INTO expenses(name, cost)";
//     const values = [
//       name,
//       cost
//     ];

//     const result = db.query(text, values);
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = mwareController;
