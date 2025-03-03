import { BiPlusCircle } from 'react-icons/bi';

interface TableOfContentItemProps {
   title: string;
   description: string;
   number: number;
   isExpanded: boolean;
   onToggle: () => void;
}

interface Section {
   title: string;
   description: string;
}

interface ReportData {
   researchMethodology: string;
   description: string;
   tableOfContent: Section[];
}

interface ReportBlockDataProps {
   data: ReportData;
}

const TableOfContentItem: React.FC<TableOfContentItemProps> = ({
   title,
   description,
   number,
   isExpanded,
   onToggle,
}) => {
   return (
      <li className='space-y-2'>
         <div
            className='flex cursor-pointer items-center justify-between bg-s-100 px-4 py-2'
            onClick={onToggle}
         >
            <p className='text-lg font-semibold text-blue-1'>
               {number}. {title}
            </p>
            {!isExpanded ? (
               <BiPlusCircle className='shrink-0 text-2xl text-blue-1' />
            ) : (
               <BiPlusCircle className='shrink-0 rotate-45 transform text-2xl text-blue-1' />
            )}
         </div>
         <div
            className={`${
               isExpanded
                  ? 'h-auto overflow-visible border-t border-s-300 py-4 pl-6'
                  : 'h-0 overflow-hidden'
            }`}
         >
            <div
               dangerouslySetInnerHTML={{ __html: description }}
               className='toc-list pl-2 [&>ol>li>ol]:pl-4'
            ></div>
         </div>
      </li>
   );
};

export default TableOfContentItem;
