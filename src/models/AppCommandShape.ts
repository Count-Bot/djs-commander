export enum AppCommandType {
  ChatInput = 1,
}

export interface BaseAppCommandShape {
  type: AppCommandType;
  name: string;
  defaultMemberPermissions?: string | bigint | number | null | undefined;
}

export interface ChatInputAppCommandShape extends BaseAppCommandShape {
  type: AppCommandType.ChatInput;
  description: string;
  options?: ChatInputOption[];
}

export type AppCommandShape = ChatInputAppCommandShape;

export enum AppCommandOptionType {
  SubCommand = 1,
  SubCommandGroup = 2,
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
  Attachment = 11,
}

// Application Command Options
export interface BaseChatInputOption {
  type: AppCommandOptionType;
  name: string;
  description: string;
}

export interface ChatInputSubCommandOption {
  type: AppCommandOptionType.SubCommand;
  name: string;
  description: string;
  options?: BaseChatInputOption[];
}

export interface ChatInputSubCommandGroupOption {
  type: AppCommandOptionType.SubCommandGroup;
  name: string;
  description: string;
  options?: ChatInputSubCommandOption[];
}

export interface AppCommandChoice {
  name: string;
  value: string;
}

export interface ChatInputStringOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
  choices?: AppCommandChoice[];
}

export interface ChatInputIntegerOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
  choices?: AppCommandChoice[];
}

export interface ChatInputBooleanOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export interface ChatInputUserOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export interface ChatInputChannelOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export interface ChatInputRoleOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export interface ChatInputMentionableOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export interface ChatInputNumberOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
  choices?: AppCommandChoice[];
}

export interface ChatInputAttachmentOption extends BaseChatInputOption {
  type: AppCommandOptionType.String;
}

export type ChatInputOption = BaseChatInputOption | ChatInputSubCommandOption | ChatInputSubCommandGroupOption;
