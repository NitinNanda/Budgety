// BUDGET CONTROLLER
var BudgetController = (function(){

})();

// UI CONTROLLER
var UIController = (function(){

})();


// GLOBAL APP CONTROLLER 
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
        // get the field input data

        // add the item to the budget controller

        // add the item to the ui

        // calculate the budget

        // display the budget to the UI

        console.log('it works');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which === 13){
            ctrlAddItem();    
        }
    });

})(BudgetController, UIController);