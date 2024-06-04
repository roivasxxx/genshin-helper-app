export default function SuccessCheckmark(props: { className: string }) {
    return (
        <svg className={props.className} viewBox="0 0 50 50">
            <path className="checkmark-path" d="M10 25 L20 35 L40 10"></path>
        </svg>
    );
}
