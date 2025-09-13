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
  const serverModule = context.asAbsolutePath(
    path.join(
      "server",
      process.platform === "win32" ? "GOBOL-LSP.exe" : "GOBOL-LSP"
    )
  );
  console.log("Launching server from:", serverModule);
  const serverOptions: ServerOptions = {
    run: { command: serverModule, transport: TransportKind.stdio },
    debug: { command: serverModule, transport: TransportKind.stdio },
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
