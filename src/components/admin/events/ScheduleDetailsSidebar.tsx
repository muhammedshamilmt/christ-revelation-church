import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Video, Edit, Trash2 } from 'lucide-react';

export interface ScheduleEvent {
  id: number;
  title: string;
  time: string;
  date?: string;
  color?: string;
  location?: string;
  platform?: string;
  participants?: number;
  description?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
}

export default function ScheduleDetailsSidebar({ isOpen, onClose, event }: SidebarProps) {
  if (!event) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-4 bottom-4 right-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">Event Details</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black leading-tight mb-4">{event.title}</h1>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-black flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{event.date || 'August 04, 2023'}</p>
                  <p className="text-xs text-gray-500 font-medium">{event.time}</p>
                </div>
              </div>

              {(event.location || event.platform) && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    {event.platform ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div className="mt-1">
                    <p className="text-sm font-bold text-black">{event.platform ? `Online (${event.platform})` : event.location}</p>
                  </div>
                </div>
              )}

              {event.participants && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-bold text-black">{event.participants} Participants</p>
                    <div className="flex -space-x-2">
                      <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=A+B&size=24" alt="Avatar" />
                      <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=C+D&size=24" alt="Avatar" />
                      <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=E+F&size=24" alt="Avatar" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          <div>
            <h3 className="text-sm font-bold text-black mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {event.description || 'No additional description provided for this event. Please refer to the agenda for more details.'}
            </p>
          </div>

        </div>
        
        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors">
            Join Meeting
          </button>
        </div>

      </div>
    </>
  );
}
