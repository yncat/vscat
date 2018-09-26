    'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
let selectionModeActive=false;
let startCursor:vscode.Position;
let endCursor:vscode.Position;
let makeCursorPosText=()=>{
    let editor = vscode.window.activeTextEditor;
    if (!editor) return false;
    const cursor = editor.selection.active;
    return 'line '+(cursor.line+1)+', position '+(cursor.character+1);
};
let displayError=()=>{
    vscode.window.showInformationMessage('Not in editor');
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('vscat enabled');
    //initialize selection mode active state
    selectionModeActive=false;

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.reportLine', () => {
        // The code you place here will be executed every time your command is executed
        let str=makeCursorPosText();
        if(str===false){
            vscode.window.showInformationMessage('not in editor');
            return;
        }
        // Display a message box to the user
        vscode.window.showInformationMessage(str);
    });

    let disposable2 = vscode.commands.registerCommand('extension.toggleSelectionMode', () => {
        let cur;
        let e=vscode.window.activeTextEditor;
        if(!e) return;
        switch(selectionModeActive){
            case false:
            cur=makeCursorPosText();
            if(cur===false){
                displayError();
                return;
            }
            startCursor=e.selection.active;
            vscode.window.showInformationMessage('starting selection from: '+cur);
            selectionModeActive=true;
            break;
            case true:
            cur=makeCursorPosText();
            if(cur===false){
                displayError();
                return;
            }
            endCursor=e.selection.active;
            if(endCursor<startCursor){//swap
                let tmp=startCursor;
                startCursor=endCursor;
                endCursor=tmp;
            }
            let r=new vscode.Range(startCursor,endCursor);
            e.selection=new vscode.Selection(r.start,r.end);
            vscode.window.showInformationMessage('selected to: '+cur);
            selectionModeActive=false;
            break;
        }//switch
    });//toggleSelectionMode

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);

}

// this method is called when your extension is deactivated
export function deactivate() {
console.log('line-reporter disabled');
}