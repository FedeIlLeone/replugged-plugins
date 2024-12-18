import { webpack } from "replugged";
import type { flux as Flux } from "replugged/common";

export enum GuildsNodeType {
  ROOT = "root",
  FOLDER = "folder",
  GUILD = "guild",
}

interface RootNode {
  children: Node[];
  type: GuildsNodeType;
}

interface FolderNode {
  children: GuildNode[];
  color: number | undefined;
  expanded: boolean;
  id: number;
  name: string | undefined;
  parentId: number | undefined;
  type: GuildsNodeType;
}

interface GuildNode {
  children: never[];
  id: string;
  parentId: number;
  type: GuildsNodeType;
  unavailable: boolean;
}

type Node = FolderNode | GuildNode;

interface TreeSnapshot {
  nodes: Record<string, Node>;
  rootChildrenIds: number[];
}

export declare class GuildsTree {
  public nodes: Record<string, Node>;
  public root: RootNode;
  public version: number;

  public get size(): number;

  private _pluckNode: (node: Node) => void;

  public addNode: (node: Node, parent?: Node | RootNode, first?: boolean) => GuildsTree;
  public allNodes: () => Node[];
  public cloneNode: (node: Node) => Node;
  public convertToFolder: (node: Node) => FolderNode;
  public getNode: (nodeId: string) => Node;
  public getRoots: () => Node[];
  public getSnapshot: () => TreeSnapshot;
  public loadSnapshot: (snapshot: TreeSnapshot) => void;
  public moveInto: (node: Node, parent: Node | RootNode, first?: boolean) => GuildsTree;
  public moveNextTo: (node: Node, target: Node, last?: boolean) => GuildsTree;
  public removeNode: (node: Node) => GuildsTree;
  public replaceNode: (target: Node, node: Node) => GuildsTree;
  public sortedGuildNodes: () => GuildNode[];
}

interface MappedFolder {
  expanded: boolean;
  folderColor: number | undefined;
  folderId: number;
  folderName: string | undefined;
  guildIds: string[];
}

interface MappedGuild {
  folderId: undefined;
  guildIds: string[];
}

interface Snapshot {
  data: { tree: TreeSnapshot };
  version: number;
}

export declare class SortedGuildStore extends Flux.SnapshotStore<Snapshot> {
  public getCompatibleGuildFolders: () => MappedFolder[] | MappedGuild[];
  public getFlattenedGuildIds: () => string[];
  public getGuildFolderById: (id: number) => MappedFolder;
  public getGuildFolders: () => MappedFolder[] | MappedGuild[];
  public getGuildsTree: () => GuildsTree;
  public takeSnapshot: () => Snapshot;
}

export default webpack.getByStoreName<SortedGuildStore>("SortedGuildStore")!;
