var KanbanBoard = /** @class */ (function () {
    function KanbanBoard() {
        var _this = this;
        this.showForm = document.querySelector('#showForm');
        this.overlay = document.querySelector('#overlay');
        this.form = document.querySelector('#addTab');
        this.addTab = document.querySelector('#addTabButton');
        this.addIdea = document.querySelector('#addIdeaButton');
        this.showForm.addEventListener('click', function () {
            _this.form.classList.add('active');
            _this.overlay.classList.add('active');
        });
        this.overlay.addEventListener('click', function () {
            _this.form.classList.remove('active');
            _this.overlay.classList.remove('active');
        });
        this.addTab.addEventListener('click', function () {
            var tab = document.querySelector('#tabName');
            var tabName = tab.value;
            var x = new Tab(tabName);
            _this.tabArray.push(x);
            _this.addToLocalStorage();
        });
        this.addIdea.addEventListener('click', function () {
            var idea = document.querySelector('#ideaName');
            var ideaName = idea.value;
            new Idea(ideaName);
        });
        this.readFromLocalStorage();
    }
    KanbanBoard.prototype.addToLocalStorage = function () {
        localStorage.setItem('tabs', JSON.stringify(this.tabArray));
    };
    KanbanBoard.prototype.readFromLocalStorage = function () {
        if (JSON.parse(localStorage.getItem('tabs')) != null)
            this.tabArray = JSON.parse(localStorage.getItem('tabs'));
    };
    KanbanBoard.prototype.drag = function () {
        var ideaList = document.querySelectorAll('.idea');
        var tabList = document.querySelectorAll('.tab');
        var draggedIdea = null;
        var _loop_1 = function (i) {
            var currentItem = ideaList[i];
            currentItem.addEventListener('dragstart', function () {
                draggedIdea = currentItem;
                setTimeout(function () {
                    currentItem.style.display = 'none';
                }, 0);
            });
            currentItem.addEventListener('dragend', function () {
                setTimeout(function () {
                    draggedIdea.style.display = 'flex';
                    draggedIdea = null;
                }, 0);
            });
        };
        for (var i = 0; i < ideaList.length; i++) {
            _loop_1(i);
        }
        for (var i = 0; i < tabList.length; i++) {
            var tab = tabList[i];
            tab.addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            tab.addEventListener('dragenter', function (e) {
                e.preventDefault();
            });
            tab.addEventListener('drop', function (e) {
                this.append(draggedIdea);
            });
        }
    };
    return KanbanBoard;
}());
var Tab = /** @class */ (function () {
    function Tab(tabName) {
        this.tabName = tabName;
        this.createTab(tabName);
    }
    Tab.prototype.createTab = function (tabName) {
        var kanban = document.querySelector('#Kanban');
        var tabDiv = document.createElement('div');
        var tabDivTitle = document.createElement('div');
        tabDiv.classList.add('tab');
        kanban.appendChild(tabDiv);
        tabDivTitle.innerHTML = tabName;
        tabDiv.appendChild(tabDivTitle);
    };
    return Tab;
}());
var Idea = /** @class */ (function () {
    function Idea(ideaName) {
        this.ideaName = ideaName;
        this.createIdea();
    }
    Idea.prototype.createIdea = function () {
        var tab = document.querySelector('.tab');
        var ideaDiv = document.createElement('div');
        ideaDiv.innerHTML = this.ideaName;
        ideaDiv.classList.add('idea');
        ideaDiv.draggable = true;
        tab.appendChild(ideaDiv);
    };
    return Idea;
}());
new KanbanBoard();
