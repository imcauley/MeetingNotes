// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "meeting-notes" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('meeting-notes.addToTodo', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let textEditor = vscode.window.activeTextEditor;
		if (textEditor === undefined) {
			return;
		}

		let document = textEditor.document;
		let text = document.getText();

		var match = text.match(/# Todo *\n(\[.*\n?)*\n?/);

		if (match === null) {
			vscode.window.showErrorMessage("Couldn't find Todo header");
		} else {
			if (match.index !== undefined) {
				let beforeText = text.slice(0, match.index);
				let beforeLines = beforeText.split(/\r\n|\r|\n/).length;

				let selectionLines = match[0].trim().split(/\r\n|\r|\n/).length;

				let line = beforeLines + selectionLines - 1;
				let insertionText = "[ ] \n";

				if (line >= document.lineCount) {
					insertionText = "\n" + insertionText;
				}

				let insertPosition = new vscode.Position(line, 0);
				let cursorPosition = new vscode.Position(line, 4);

				textEditor.edit(editBuilder => {
					editBuilder.insert(insertPosition, insertionText);
				});

				textEditor.selection = new vscode.Selection(cursorPosition, cursorPosition);
			}
		}



	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
