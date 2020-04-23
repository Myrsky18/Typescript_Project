class KanbanBoard {

    tabArray: Array<Tab>;
    showForm: HTMLButtonElement = document.querySelector('#showForm');
    overlay: HTMLDivElement = document.querySelector('#overlay');
    form: HTMLDivElement = document.querySelector('#addTab');
    addTab: HTMLInputElement = document.querySelector('#addTabButton');
    addIdea: HTMLInputElement = document.querySelector('#addIdeaButton');

    constructor() {
        this.showForm.addEventListener('click', () => {
            this.form.classList.add('active');
            this.overlay.classList.add('active');
        })

        this.overlay.addEventListener('click', () => {
            this.form.classList.remove('active');
            this.overlay.classList.remove('active');
        })
        
        this.addTab.addEventListener('click', () => {
           let tab: HTMLInputElement = document.querySelector('#tabName');
           let tabName: string = tab.value;
            new Tab(tabName);
            this.addToLocalStorage();
        })

        this.addIdea.addEventListener('click', () => {
            let idea: HTMLInputElement = document.querySelector('#ideaName');
            let ideaName: string = idea.value;
            new Idea(ideaName);
            
        })

        this.readFromLocalStorage();
        
    }
    addToLocalStorage() {
        localStorage.setItem('tabs' , JSON.stringify(this.tabArray))
    }
    readFromLocalStorage() {
        if (JSON.parse(localStorage.getItem('tabs')) != null)
        this.tabArray = JSON.parse(localStorage.getItem('tabs'))
    }

    
    
    drag() {
        let ideaList = document.querySelectorAll('.idea');
        let tabList = document.querySelectorAll('.tab');
        let draggedIdea: HTMLElement = null;

        for(let i = 0; i < ideaList.length; i++){
            let currentItem: HTMLElement = ideaList[i];

            currentItem.addEventListener('dragstart', () => {
                draggedIdea = currentItem;
                setTimeout(() => {
                    currentItem.style.display = 'none';
                }, 0)
            });

            currentItem.addEventListener('dragend', () => {
                setTimeout(() => {
                    draggedIdea.style.display = 'flex';
                    draggedIdea = null;
                }, 0)
            });
        }

        for(let i = 0; i < tabList.length; i++){
            const tab: HTMLElement = tabList[i];

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

class Tab {

    tabName: string;

    constructor(tabName: string) {
        this.tabName = tabName;
        
    }

    
    
    
}

class Idea {

    ideaName:string;

    constructor(ideaName: string) {

        this.ideaName = ideaName;
        

    }

    
}

new KanbanBoard();