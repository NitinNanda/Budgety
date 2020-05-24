// BUDGET CONTROLLER
var BudgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }, 
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            ID = 0;

            // creating new ID for new exp or inc objects
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else{
                ID = 0;
            }

            if(type === 'exp'){
                newItem =  new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem =  new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }

        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data);
        }
    };
})();

// UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        /*
            1) every number to 2 decimal points
            2) comma separating thousands
        */
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };


    return{
        getInput: function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItems: function(obj, type){
            var html, newHtml, element, fields, fieldsArr;
            // create html string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // replace placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields:function(){
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(cur, index, array){
                cur.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){
            var fields;

            fields = document.querySelectorAll(DOMStrings.expensesPerLabel);
            nodeListForEach(fields, function(curr, index){
                if(percentages[index] > 0){
                    curr.textContent = percentages[index] + '%';
                }else{
                    curr.textContent = '---';
                }
                
            });
        },

        displayMonth: function(){
            var now, year, month, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' +year;
        },

        changeType: function(){
            var fields;

            fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            
            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function(){

        // calculate the budget
        budgetCtrl.calculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // display the budget to the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        // calculate the percentages
        budgetCtrl.calculatePercentages();

        // read them from budget controller
        var percentages = budgetCtrl.getPercentages();

        // Update the UI with new percentages
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function(){
        var input, newItem;

        // get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the item to the UI
            UICtrl.addListItems(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate an update budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event){
        var itemId, splitId, type, id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            // delete item from UI
            UICtrl.deleteListItem(itemId);

            // update the new budget
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init : function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(BudgetController, UIController);

controller.init();