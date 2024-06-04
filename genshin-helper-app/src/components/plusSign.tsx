export default function PlusSign(props: {
    containerClass: string;
    iconClass: string;
}) {
    return (
        <div className={`relative group ${props.containerClass}`}>
            <span
                className={`absolute bottom-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] w-1/2 ${props.iconClass}`}
            />
            <span
                className={`absolute bottom-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] h-1/2 ${props.iconClass}`}
            />
        </div>
    );
}
