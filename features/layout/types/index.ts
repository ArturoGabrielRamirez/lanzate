import { Props as LoadingSubmitButtonProps } from "./loading-submit-button-type";
export { type ResponseType } from "./response-type"
import { FormPropsType } from "./form-type";
import { ButtonWithPopupPropsType } from "./button-with-popup-type";
import { Props as LayoutProps } from "./layout-type";
import { EntityType } from "@prisma/client";
import { ActionType } from "@prisma/client";
export { type TitleProps } from "./title-type"

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
    FormPropsType,
    ButtonWithPopupPropsType,
    LayoutProps
}

export * from "@/features/layout/types/page-container.types"