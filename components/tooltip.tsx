import { InformationCircleIcon } from "@heroicons/react/outline";


export default function Tooltip(value) {
    return (
        <>
            <div className="ml-1 text-white inset-y-0 -right-4 flex items-center group">
                <div className="absolute flex flex-col items-center">
                    <div className="w-36 md:w-40 lg:md-40 absolute -right-6 bottom-0 flex-col items-right mb-3 hidden group-hover:flex">
                        <span className="leading-4 min z-10 p-2 text-xs text-white whitespace-no-wrap bg-darkblue-300 shadow-lg rounded-md">
                            {value}
                        </span>
                        <div className="absolute right-0 bottom-0 origin-top-left w-3 h-3 -mt-2 rotate-45 bg-darkblue-100"></div>
                    </div>
                </div>
                <div className="justify-self-end">
                    <InformationCircleIcon className="h-5 w-5 opacity-30" aria-hidden="true" />
                </div>
            </div>
        </>
    )
}