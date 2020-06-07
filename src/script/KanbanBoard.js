"use strict";
exports.__esModule = true;
var Tab_1 = require("./Tab");
var Idea_1 = require("./Idea");
var KanbanBoard = /** @class */ (function () {
    function KanbanBoard() {
        var _this = this;
        this.tabArray = [];
        this.kanban = document.querySelector('#Kanban');
        this.showForm = document.querySelector('#showForm');
        this.overlay = document.querySelector('#overlay');
        this.form = document.querySelector('#addTab');
        this.addTab = document.querySelector('#addTabButton');
        this.addIdea = document.querySelector('#addIdeaButton');
        this.tab = document.querySelector('#tabName');
        this.ideaFrom = document.querySelector('#showIdeaForm');
        this.idea = document.querySelector('#ideaName');
        this.ideaForm = document.querySelector('#addIdea');
        this.showForm.addEventListener('click', function () {
            _this.showCreationForm();
        });
        this.overlay.addEventListener('click', function () {
            _this.hideCreationFrom();
        });
        this.addTab.addEventListener('click', function () {
            _this.createAndHide();
        });
        this.tab.addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                _this.createAndHide();
            }
        });
        this.ideaFrom.addEventListener('click', function () {
            _this.ideaForm.classList.add('active');
            _this.overlay.classList.add('active');
        });
        this.addIdea.addEventListener('click', function () {
            _this.createIdea(_this.idea.value);
        });
        this.readFromLocalStorage();
        this.writeTabs(this.tabArray);
        console.log(this.tabArray);
        this.drag();
    }
    KanbanBoard.prototype.addToLocalStorage = function () {
        localStorage.setItem('tabs', JSON.stringify(this.tabArray));
    };
    KanbanBoard.prototype.readFromLocalStorage = function () {
        if (JSON.parse(localStorage.getItem('tabs')) != null)
            this.tabArray = JSON.parse(localStorage.getItem('tabs'));
    };
    KanbanBoard.prototype.writeTabs = function (tabArray) {
        var _this = this;
        tabArray.forEach(function (tab) {
            _this.createTabBody(tab.tabName);
            tab.ideaArray.forEach(function (idea) {
                _this.createIdeaBody(idea.ideaName);
            });
        });
    };
    KanbanBoard.prototype.createAndHide = function () {
        this.createTab(this.tab.value);
        this.hideCreationFrom();
    };
    KanbanBoard.prototype.createTab = function (tabName) {
        var tab = new Tab_1.Tab(tabName);
        this.tabArray.push(tab);
        this.createTabBody(tabName);
        this.addToLocalStorage();
    };
    KanbanBoard.prototype.createIdea = function (ideaName) {
        var idea = new Idea_1.Idea(ideaName);
        this.tabArray[0].ideaArray.push(idea);
        this.createIdeaBody(ideaName);
        this.addToLocalStorage();
    };
    KanbanBoard.prototype.createTabBody = function (tabName) {
        var tabDiv = document.createElement('div');
        var tabTitleDiv = document.createElement('div');
        tabDiv.setAttribute('id', tabName);
        tabDiv.classList.add('tab');
        this.kanban.appendChild(tabDiv);
        tabTitleDiv.classList.add('tabTitle');
        tabTitleDiv.innerHTML = tabName;
        tabDiv.appendChild(tabTitleDiv);
        this.createTabButton(tabTitleDiv);
    };
    KanbanBoard.prototype.createTabButton = function (tabTitleDiv) {
        var renameButton = document.createElement('button');
        renameButton.classList.add('editButtons');
        tabTitleDiv.appendChild(renameButton);
    };
    KanbanBoard.prototype.createIdeaBody = function (ideaName) {
        var tabDiv = document.querySelector('.tab');
        var idea = document.createElement('div');
        idea.classList.add('idea');
        idea.innerHTML = ideaName;
        tabDiv.appendChild(idea);
        idea.draggable = true;
    };
    KanbanBoard.prototype.showCreationForm = function () {
        this.form.classList.add('active');
        this.overlay.classList.add('active');
    };
    KanbanBoard.prototype.hideCreationFrom = function () {
        this.form.classList.remove('active');
        this.overlay.classList.remove('active');
    };
    KanbanBoard.prototype.drag = function () {
        var ideaList = document.querySelectorAll('.idea');
        var tabList = document.querySelectorAll('.tab');
        var draggedIdea = null;
        var _loop_1 = function (i) {
            var currentItem = ideaList[i];
            currentItem.addEventListener('dragstart', function () {
                draggedIdea = currentItem;
                console.log(currentItem.parentNode);
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
exports.KanbanBoard = KanbanBoard;
document.addEventListener('DOMContentLoaded', function () {
    new KanbanBoard();
});
