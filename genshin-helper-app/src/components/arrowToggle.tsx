export default function ArrowToggle(props: {
    strokeWidth: number;
    isOpen: boolean;
}) {
    const { strokeWidth, isOpen } = props;

    return (
        <svg
            className={`w-5 h-5 transition-transform duration-300 transform ${
                isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}
