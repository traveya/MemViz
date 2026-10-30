# MemViz README

Prototype memory visualization VSCode extension tool using PythonTutor API by Professor Philip Guo of University of California, San Diego. 

## Features

Features

Python and C Support: Visualize program execution for both Python (.py) and C (.c) files.

Automatic Updates: MemViz automatically refreshes its visualization after changes to the active file or changing which file is active.

Integrated Sidebar: The visualization appears directly inside VS Code.

## Requirements

Node.js and npm are required to run this VSCode extension
Download Node.js and run npm install

## Instructions

Clone the MemViz repository and open the project folder in VS Code. (make sure to open the root folder containing package.json and src/extension.ts)
Compile the TypeScript source code: npm run compile
Navigate to Run > Start Debugging. This launches a new VS Code window called the Extension Development Host.
Locate the MemViz icon in the terminal activity bar and open it.
Create or open a new Python or C file and the MemViz panel should update with your code.
Refer to instructions at https://pythontutor.com/visualize.html#mode=edit for how to step through code and view memory visualizations.

## Reference and Acknowledgement
Guo, Philip J. "Online Python Tutor: Embeddable Web-Based Program Visualization for CS Education." Proceedings of the 44th ACM Technical Symposium on Computer Science Education, ACM, 2013, pp. 579–584. https://doi.org/10.1145/2445196.2445368.
