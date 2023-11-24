import { 
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shadcn-components/ui/popover'
import { Button } from '@/shadcn-components/ui/button';
import { Icon } from '@iconify/react';
import emoji_data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export interface EmojiPickerProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
  }

export const EmojiPicker = ({ input, setInput }: EmojiPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' size='icon' className="max-sm:h-12 max-sm:w-12">
                <Icon icon="lucide:smile" className="h-5 w-5"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-0' style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
                <Picker 
                    data={emoji_data}
                    onEmojiSelect={(emoji: any) => setInput(input + emoji.native)} 
                    previewPosition='none' 
                    searchPosition='none' 
                    navPosition='none' 
                    perLine={7} 
                    theme='light'
                />
            </PopoverContent>
        </Popover>
    )
}