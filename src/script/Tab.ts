import {Idea} from './Idea';

export class Tab {

    tabName: string;
    ideaArray: Array<Idea> = [];

    constructor(tabName: string) {
        this.tabName = tabName;
        
    }
    
}