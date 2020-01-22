/* SystemJS module definition */
declare var module: NodeModule;
declare var System: System;
interface NodeModule {
  id: string;
}
interface System {
  import(request: string): Promise<any>;
}
