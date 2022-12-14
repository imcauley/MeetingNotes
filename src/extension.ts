// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let todo = vscode.commands.registerCommand('meeting-notes.addToTodo', () => {
		addToList("Todo");
	});
	let agenda = vscode.commands.registerCommand('meeting-notes.addToAgenda', () => {
		addToList("Agenda");
	});
	let notes = vscode.commands.registerCommand('meeting-notes.addToNotes', () => {
		addToList("Notes");
	});


	context.subscriptions.push(todo);
	context.subscriptions.push(agenda);
	context.subscriptions.push(notes);
}

function getListRegexp(list: String) {
	if (list === 'Todo') {
		return /# Todo *\n(\[.*\n?)*\n?/;
	}
	if (list === 'Agenda') {
		return /# Agenda *\n(\-.*\n?)*\n?/;
	}
	if (list === 'Notes') {
		return /# Notes *\n(\-.*\n?)*\n?/;
	}

	throw new Error("Wrong list type");
}

function getListDelimiter(list: String) {
	if (list === 'Todo') {
		return "[ ]";
	}

	return "-";
}

function addToList(list: String) {
	let textEditor = vscode.window.activeTextEditor;
	if (textEditor === undefined) {
		return;
	}

	let document = textEditor.document;
	let text = document.getText();

	var match = text.match(getListRegexp(list));

	if (match === null) {
		vscode.window.showErrorMessage("Couldn't find " + list + "  header");
		return;
	}

	if (match.index === undefined) {
		return;
	}

	let beforeText = text.slice(0, match.index);
	let beforeLines = beforeText.split(/\r\n|\r|\n/).length;

	let selectionLines = match[0].trim().split(/\r\n|\r|\n/).length;

	let line = beforeLines + selectionLines - 1;
	let insertionText = getListDelimiter(list) + " \n";

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

// This method is called when your extension is deactivated
export function deactivate() { }
