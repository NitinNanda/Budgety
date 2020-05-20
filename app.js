// BUDGET CONTROLLER
var BudgetController = (function(){

    


})();

// UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'
    }
    return{
        getInput: function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings : function(){
            return DOMStrings;
        }
    };
})();


// GLOBAL APP CONTROLLER 
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();    
            }
        });
    };

    var ctrlAddItem = function(){
        // get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        // add the item to the budget controller

        // add the item to the ui

        // calculate the budget

        // display the budget to the UI

    };

    return {
        init : function(){
            setupEventListeners();
        }
    };

})(BudgetController, UIController);

controller.init();