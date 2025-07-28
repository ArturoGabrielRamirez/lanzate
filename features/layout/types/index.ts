import { Props as LoadingSubmitButtonProps } from "./loading-submit-button-type";
import { ResponseType } from "./response-type";
import { FormPropsType } from "./form-type";
import { ButtonWithPopupPropsType } from "./button-with-popup-type";
import { Props as LayoutProps } from "./layout-type";
import { EntityType } from "@prisma/client";
import { ActionType } from "@prisma/client";

export type InsertLogEntryProps = {
    action: ActionType,
    entity_id: number,
    entity_type: EntityType,
    details?: string,
    action_initiator?: string,
    user_id?: number
}

export type {
    LoadingSubmitButtonProps,
    ResponseType,
    FormPropsType,
    ButtonWithPopupPropsType,
    LayoutProps
}