import React from 'react';
import { RoomHeader } from './RoomHeader.jsx';
import { InterventionSidebar } from './InterventionSidebar.jsx';
import { MessageList } from './MessageList.jsx';
import { MessageComposer } from './MessageComposer.jsx';

export function CareerRoomWorkspace() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 75px)', overflow: 'hidden' }}>
      <RoomHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <InterventionSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
          <MessageList />
          <MessageComposer />
        </div>
      </div>
    </div>
  );
}
