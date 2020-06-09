import {Tab} from "./Tab";
import {Idea} from "./Idea"

export class KanbanBoard {

    tabArray: Array<Tab> = [];
    kanban: HTMLDivElement = document.querySelector('#Kanban');
    showForm: HTMLButtonElement = document.querySelector('#showForm');
    overlay: HTMLDivElement = document.querySelector('#overlay');
    form: HTMLDivElement = document.querySelector('#addTab');
    addTab: HTMLInputElement = document.querySelector('#addTabButton');
    addIdea: HTMLInputElement = document.querySelector('#addIdeaButton');
    tab: HTMLInputElement = document.querySelector('#tabName');
    idea: HTMLInputElement = document.querySelector('#ideaName');
    ideaForm: HTMLDivElement = document.querySelector('#addIdea');
    tabId: string;
    tabIndex: number;

    constructor() {
        this.showForm.addEventListener('click', () => {
            this.showCreationForm(this.form);
        })

        this.overlay.addEventListener('click', () => {
            if(this.form.classList.contains('active')){
                this.hideCreationFrom(this.form);
            }else {
                this.hideCreationFrom(this.ideaForm);
            }
            
        })
        
        this.addTab.addEventListener('click', () => {
           this.createAndHide();
        })
        this.tab.addEventListener('keyup', (e) => {
           if(e.keyCode == 13) {
                this.createAndHide();
           }
        })
        this.addIdea.addEventListener('click', (e) => {
            this.createAndHideIdeaForm(e);
        })
        
        this.readFromLocalStorage();
        this.writeTabs(this.tabArray);
        this.drag();
        
        
    }
    addToLocalStorage() {
        localStorage.setItem('tabs' , JSON.stringify(this.tabArray))
    }
    readFromLocalStorage() {
        if (JSON.parse(localStorage.getItem('tabs')) != null)
        this.tabArray = JSON.parse(localStorage.getItem('tabs'))
    }
    addToLocalStorageAndReload() {
        this.addToLocalStorage();
        location.reload();
    }
   
    writeTabs(tabArray: Array<Tab>){
        for(let i = 0; i < tabArray.length; i++){
            this.createTabBody(tabArray[i].tabName);
            for(let j = 0; j < tabArray[i].ideaArray.length; j++){

                this.createIdeaBody(tabArray[i].ideaArray[j].ideaName,tabArray[i].tabName);

            }
        }
    }

    createAndHide() {

        this.createTab(this.tab.value);
        location.reload();


    }
    
    createAndHideIdeaForm(e) {
        this.createIdea(this.idea.value,e);
        location.reload();
    }
    showCreationForm(form) {

        form.classList.add('active');
        this.overlay.classList.add('active');

    }
    hideCreationFrom(form) {

        form.classList.remove('active');
        this.overlay.classList.remove('active');

    }

    createTab(tabName:string) {

            let tab = new Tab(tabName);
            this.tabArray.push(tab);
            this.createTabBody(tabName);
            this.addToLocalStorage();

    }
    createIdea(ideaName: string, e) {

            let idea = new Idea(ideaName);
            this.tabArray[this.tabIndex].ideaArray.push(idea);
            this.createIdeaBody(ideaName, this.tabId);
            this.addToLocalStorage();
        
    }
    createTabBody(tabName: string) {
        
        let tabDiv: HTMLDivElement = document.createElement('div');
        let tabTitleDiv: HTMLDivElement = document.createElement('div');

        tabDiv.setAttribute('id', tabName);
        tabDiv.classList.add('tab');

        this.kanban.appendChild(tabDiv);
        tabTitleDiv.classList.add('tabTitle');
        tabTitleDiv.innerHTML = tabName;

        this.createRemoveTabButton(tabDiv,tabName);
        tabDiv.appendChild(tabTitleDiv);
        this.createAddIdeaButton(tabTitleDiv);
        
    }

    createRemoveTabButton(tabTitleDiv: HTMLDivElement, tabName:string) {
        let removeButton: HTMLDivElement = document.createElement('div');
        removeButton.classList.add('removeButton');
        removeButton.innerHTML = 'x';
        removeButton.addEventListener('click', () => this.removeTab(tabName));  

        tabTitleDiv.appendChild(removeButton);       
    }

    createAddIdeaButton(tabTitleDiv: HTMLDivElement) {
        const addIdeaButton: HTMLButtonElement = document.createElement('button');

        addIdeaButton.classList.add('addButton');
        addIdeaButton.innerHTML = "+";
        tabTitleDiv.appendChild(addIdeaButton);

        addIdeaButton.addEventListener('click', (e) => {
            this.showCreationForm(this.ideaForm);
            this.tabId = this.getProperParent(e);
            this.tabIndex = this.getTabIndex(this.tabId);
        })
    }

    createIdeaBody(ideaName: string, tabName:string) {
        let tabDiv: HTMLDivElement = document.querySelector('#' + tabName);
        let idea: HTMLDivElement = document.createElement('div');

        idea.classList.add('idea');
        idea.setAttribute('id',ideaName);
        idea.innerHTML = ideaName;
        tabDiv.appendChild(idea);
        idea.draggable = true;
        
        this.removeIdeaButton(idea);
    }
    removeIdeaButton(ideaDiv: HTMLDivElement) {
        const removeIdeaButton: HTMLButtonElement = document.createElement('button');

        removeIdeaButton.classList.add('removeButton');
        removeIdeaButton.innerHTML = 'x';
        ideaDiv.appendChild(removeIdeaButton);

        removeIdeaButton.addEventListener('click', (e) => this.removeIdea(e));
    }
    removeIdea(e) {
        const tabId:string = this.getProperParent(e);
        const ideaId:string = this.getParentId(e);
        const tabIndex:number = this.getTabIndex(tabId);
        const ideaIndex = this.getIdeaIndex(tabIndex,ideaId);
        this.tabArray[tabIndex].ideaArray.splice(ideaIndex,1);
        this.addToLocalStorageAndReload();

    }
    removeTab(tabName: string)  {

        const tabIndex: number = this.getTabIndex(tabName);
        this.tabArray.splice(tabIndex,1);
        this.addToLocalStorageAndReload();

    }

    
    getProperParent(e) {

        return e.target.parentNode.parentNode.id;

    }
    getParentId(e){

        return e.target.parentNode.id;

    }

    getIdeaId(e){

        return e.target.id;

    }

    getTabIndex(id: string) {

        return this.tabArray.map(function(e) {
            return e.tabName;
        }).indexOf(id);

    }

    getIdeaIndex(tabIndex: number, ideaId: string) {

        return this.tabArray[tabIndex].ideaArray.map(function(e) {
            return e.ideaName
        }).indexOf(ideaId);

    }
    

    drag() {

        let ideaList = document.querySelectorAll('.idea');
        let tabList = document.querySelectorAll('.tab');
        let draggedIdea = null;
        let currIdea = {} as Idea;
        let tabIndex:number ;
        let ideaIndex: number;

        for(let i = 0; i < ideaList.length; i++){
            let currentItem = ideaList[i];

            currentItem.addEventListener('dragstart', (e) => {
                draggedIdea = currentItem;
                const ideaId: string = currentItem.innerHTML;

                const tabId: string = this.getParentId(e);
                tabIndex = this.getTabIndex(tabId);
                ideaIndex = this.getIdeaIndex(tabIndex,ideaId);
                
                currIdea.ideaName = ideaId;
                this.addToLocalStorage();
            });

            currentItem.addEventListener('dragend', (e) => {
                setTimeout(() => {
                    draggedIdea.style.display = 'flex';
                    this.tabArray[tabIndex].ideaArray.splice(ideaIndex,1);

                    const newTabId: string = this.getParentId(e);
                    const newTabIndex: number = this.getTabIndex(newTabId);
                
                    this.tabArray[newTabIndex].ideaArray.push(currIdea);
                    this.addToLocalStorage();
                    draggedIdea = null;
                }, 0)

            });
        }

        for(let i = 0; i < tabList.length; i++){
            const tab = tabList[i];

            tab.addEventListener('dragover', (e: any) => {
                e.preventDefault();
                
            });

            tab.addEventListener('dragenter', (e: any) => {
                e.preventDefault();
            });

            tab.addEventListener('drop', function (e: any)  {
                this.append(draggedIdea);
            })
            
        }  

    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KanbanBoard();
});
