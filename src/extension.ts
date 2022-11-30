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
	let disposable = vscode.commands.registerCommand('meeting-notes.helloWorld', () => {
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
				let message = match.index + match.length;
				vscode.window.showInformationMessage(message.toString());

				textEditor.edit(editBuilder => {
					editBuilder.insert(new vscode.Position(message + 2, 0), "[ ] test\n");
				});
			}
		}



	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
