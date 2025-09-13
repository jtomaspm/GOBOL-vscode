import * as os from "os";
import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverExecutable = path.join(os.homedir(), ".local","bin","GOBOL-LSP")
  const serverArgs = [
    "-log_path",
    path.join(os.homedir(), ".local","share","logs", "gobol-lsp.log"),
    "-interface",
    "stdio"
  ];

  const serverOptions: ServerOptions = {
    run: { command: serverExecutable, args: serverArgs, transport: TransportKind.stdio, options: {env: process.env} },
    debug: { command: serverExecutable, args: serverArgs, transport: TransportKind.stdio, options: {env: process.env} },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "cobol" }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher("**/.PCOD"),
    },
  };

  client = new LanguageClient(
    "gobol-client",
    "GOBOL-Client",
    serverOptions,
    clientOptions
  );

  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
