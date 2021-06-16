import React, { Component } from 'react'
//import PremadeCategory from '../WalletComponents/PremadeCategory'



class AllCategories extends Component {



    // addCategory (e){

    //     return 
    // }
 
    render() {
        
        
       
    //    const allCategories = this.props.allCategories.map((category) => (
             
    //         <PremadeCategory key={category.id} category={category} type={category.expense_state}  onClick={this.handleUpdate} deleteCategory={this.props.deleteCategory}/>
       
    //    ))
       //console.log("something")
      this.props.categories = {category}
       return (
        <div className="allCatContainer">
            <h3 className="">Customize Categories by adding them to your Wallet</h3>
            
            {/* <PremadeCategory key={this.props.categories.id} category={this.props.categories} onClick={this.addCategory} /> */}
            <button onClick={() => {console.log(this.props.allCategories, "category")}}>Click ME</button>
               
                {/* {allCategories} */}
                
          
        </div>
       )
   }
}
export default AllCategories;
