
import React, { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'trending' | 'suggestion'
}

interface SearchWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'iPhone 15', type: 'trending' },
  { id: '2', text: 'Toyota Corolla', type: 'trending' },
  { id: '3', text: 'Samsung TV', type: 'recent' },
  { id: '4', text: 'Office chair', type: 'recent' },
  { id: '5', text: 'Laptop bag', type: 'suggestion' },
]

export const SearchWithSuggestions = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search for vehicles, electronics, furniture...",
  className
}: SearchWithSuggestionsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(s => 
        s.text.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions(mockSuggestions.slice(0, 5))
      setIsOpen(false)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    onSearch(suggestion.text)
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
    setIsOpen(false)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </form>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-left"
              >
                {getSuggestionIcon(suggestion.type)}
                <span>{suggestion.text}</span>
                {suggestion.type === 'trending' && (
                  <span className="ml-auto text-xs text-orange-500">Trending</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
