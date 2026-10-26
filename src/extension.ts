import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('MemViz for CS50 Active!');

	const provider = new MemVizViewProvider();

	// Register the MemViz webview
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'memviz.webview',
			provider
		)
	);

	// Timer used to debounce edits
	let updateTimer: ReturnType<typeof setTimeout> | undefined;

	// Helper to visualize the currently active editor
	function visualizeEditor(editor: vscode.TextEditor | undefined) {
		if (!editor) {
			return;
		}

		const language = editor.document.languageId;

		if (
			language !== 'python' &&
			language !== 'c'
		) {
			return;
		}

		provider.visualize(
			editor.document.getText(),
			language
		);
	}

	// Watch for changes to the current file
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event) => {

			// Only support Python and C files
			if (
				event.document.languageId !== 'python' &&
				event.document.languageId !== 'c'
			) {
				return;
			}

			// Only visualize the file currently being edited
			const editor = vscode.window.activeTextEditor;

			if (!editor || editor.document !== event.document) {
				return;
			}

			// User typed again, so reset the timer
			if (updateTimer) {
				clearTimeout(updateTimer);
			}

			// Update after 750 ms of inactivity
			updateTimer = setTimeout(() => {

				console.log(
					`Updating MemViz for ${event.document.languageId}`
				);

				visualizeEditor(editor);

			}, 750);
		})
	);

	// Automatically refresh when switching between files/tabs
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {

			if (!editor) {
				return;
			}

			const language = editor.document.languageId;

			if (
				language !== 'python' &&
				language !== 'c'
			) {
				return;
			}

			console.log(
				`Switched to ${language} file`
			);

			visualizeEditor(editor);
		})
	);

	// Manual visualization command
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'memviz.visualizeCurrentFile',
			() => {
				const editor = vscode.window.activeTextEditor;

				if (!editor) {
					vscode.window.showErrorMessage(
						'No file is currently open.'
					);
					return;
				}

				const language = editor.document.languageId;

				if (
					language !== 'python' &&
					language !== 'c'
				) {
					vscode.window.showErrorMessage(
						'The current file must be a Python or C file.'
					);
					return;
				}

				visualizeEditor(editor);
			}
		)
	);

	// Visualize the file that is already open when the extension activates
	visualizeEditor(vscode.window.activeTextEditor);
}


class MemVizViewProvider implements vscode.WebviewViewProvider {

	private view?: vscode.WebviewView;

	private currentCode: string = ``;
	private currentLanguage: string = 'python';

	resolveWebviewView(
		webviewView: vscode.WebviewView
	) {
		this.view = webviewView;

		webviewView.webview.options = {
			enableScripts: true
		};

		this.updateWebview();
	}

	public visualize(code: string, language: string) {
		this.currentCode = code;
		this.currentLanguage = language;

		this.updateWebview();
	}

	private updateWebview() {
		if (!this.view) {
			return;
		}

		this.view.webview.html =
			this.getHtml(
				this.currentCode,
				this.currentLanguage
			);
	}

	private getHtml(
		code: string,
		language: string
	): string {

		const encodedCode =
			encodeURIComponent(code);

		let tutorLanguage: string;

		if (language === 'c') {
			tutorLanguage = 'c';
		} else {
			tutorLanguage = '311';
		}

		const pythonTutorUrl =
			`https://pythontutor.com/iframe-embed.html` +
			`#code=${encodedCode}` +
			`&py=${tutorLanguage}` +
			`&curInstr=0`;

		return `
			<!DOCTYPE html>
			<html lang="en">

			<head>
				<meta charset="UTF-8">

				<style>
					html,
					body {
						width: 100%;
						height: 100%;
						margin: 0;
						padding: 0;
						overflow: hidden;
					}

					iframe {
						width: 100%;
						height: 100%;
						border: none;
						background-color: #EEEEEE;
					}
				</style>
			</head>

			<body>
				<iframe
					src="${pythonTutorUrl}">
				</iframe>
			</body>

			</html>
		`;
	}
}


export function deactivate() {}