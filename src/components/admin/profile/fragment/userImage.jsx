export default function UserImage({
    url,
}){
    return (
        <img
        src={url}
        className={`shadow-xl object-cover ring-2 ring-white rounded-full h-auto min-h-[100px] min-w-[100px] align-middle border-none absolute -m-16 lg:-ml-16 max-w-150-px bg-white`}
        />
    );
}