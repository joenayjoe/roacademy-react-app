export type modalDataType = {
    heading: string;
    submitBtnText: string;
    closeBtnText: string;
    children: JSX.Element | string;
};

export const defaultModalData: modalDataType = {
    heading: "Modal Heading",
    submitBtnText: "Submit",
    closeBtnText: "Cancel",
    children: "modal body"
}