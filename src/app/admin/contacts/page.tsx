"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Search, Mail, Star, Archive, Trash2, Reply, MailOpen, MailX, Phone, Calendar, AlertCircle } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high'
  starred: boolean
  createdAt: string
  updatedAt: string
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    // Gerçek API çağrısı burada olacak
    setContacts([])
  }, [])

  const getPriorityBadge = (priority: Contact['priority']) => {
    const priorityConfig = {
      low: { label: 'Düşük', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Orta', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'Yüksek', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    }
    return priorityConfig[priority]
  }

  const getStatusBadge = (status: Contact['status']) => {
    const statusConfig = {
      unread: { label: 'Okunmadı', variant: 'destructive' as const },
      read: { label: 'Okundu', variant: 'default' as const },
      replied: { label: 'Yanıtlandı', variant: 'success' as const },
      archived: { label: 'Arşivlendi', variant: 'secondary' as const }
    }
    return statusConfig[status]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          İletişim Yönetimi
        </h1>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Mesaj</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Okunmamış</CardTitle>
            <MailX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {contacts.filter(c => c.status === 'unread').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yanıtlanan</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {contacts.filter(c => c.status === 'replied').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arşivlenen</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'archived').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtreler */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Mesaj ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="unread">Okunmamış</SelectItem>
                <SelectItem value="read">Okunmuş</SelectItem>
                <SelectItem value="replied">Yanıtlanmış</SelectItem>
                <SelectItem value="archived">Arşivlenmiş</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Öncelik Filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Öncelikler</SelectItem>
                <SelectItem value="low">Düşük</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mesaj Listesi */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>İletişim Mesajları</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz mesaj bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Konu</th>
                    <th className="text-left p-2">Gönderen</th>
                    <th className="text-left p-2">İletişim</th>
                    <th className="text-left p-2">Durum</th>
                    <th className="text-left p-2">Öncelik</th>
                    <th className="text-left p-2">Tarih</th>
                    <th className="text-left p-2">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.filter((contact) => {
                    return (
                      (statusFilter === 'all' || contact.status === statusFilter) &&
                      (priorityFilter === 'all' || contact.priority === priorityFilter) &&
                      (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contact.message.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                  }).map((contact) => {
                    const statusConfig = getStatusBadge(contact.status)
                    const priorityConfig = getPriorityBadge(contact.priority)
                    return (
                      <tr key={contact.id} className={`border-b hover:bg-gray-50 ${contact.status === 'unread' ? 'bg-blue-50' : ''}`}>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {contact.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            <div>
                              <div className={`font-medium ${contact.status === 'unread' ? 'font-bold' : ''}`}>
                                {contact.subject}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {contact.message}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">{contact.name}</div>
                        </td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant={statusConfig.variant as "destructive" | "default" | "secondary" | "outline"}>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={priorityConfig.color}>
                            {priorityConfig.label}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(contact.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Star toggle functionality
                              }}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Mark as read functionality
                              }}
                            >
                              <MailOpen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact)
                                setIsReplyModalOpen(true)
                              }}
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Archive functionality
                              }}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Delete functionality
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {isReplyModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mesajı Yanıtla</h2>
              <Button variant="ghost" onClick={() => setIsReplyModalOpen(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kime:</label>
                <div className="text-sm text-gray-600">{selectedContact.name} ({selectedContact.email})</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Konu:</label>
                <div className="text-sm text-gray-600">Re: {selectedContact.subject}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Yanıt:</label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Yanıtınızı yazın..."
                  rows={6}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
                İptal
              </Button>
              <Button onClick={() => {
                // Send reply functionality
                setIsReplyModalOpen(false)
                setReplyMessage('')
              }}>
                Gönder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsPage
