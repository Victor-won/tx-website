"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  Trash2,
  Eye,
  Filter,
  X,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: "PENDING" | "REPLIED" | "RESOLVED" | "ARCHIVED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const locale = useLocale();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/contacts?${params}`);
      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("获取联系列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setNotes(contact.notes || "");
  };

  const handleUpdateStatus = async (id: string, status: Contact["status"]) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setSelectedContact({ ...selectedContact, notes });
        fetchContacts();
      }
    } catch (error) {
      console.error("保存备注失败:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "zh" ? "确定要删除这条记录吗？" : "Are you sure to delete this record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const getStatusBadge = (status: Contact["status"]) => {
    const statusConfig = {
      PENDING: { label: locale === "zh" ? "待处理" : "Pending", className: "bg-yellow-100 text-yellow-800" },
      REPLIED: { label: locale === "zh" ? "已回复" : "Replied", className: "bg-blue-100 text-blue-800" },
      RESOLVED: { label: locale === "zh" ? "已解决" : "Resolved", className: "bg-green-100 text-green-800" },
      ARCHIVED: { label: locale === "zh" ? "已归档" : "Archived", className: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === "zh" ? "留言管理" : "Contact Management"}
          </h1>
          <p className="text-gray-600">
            {locale === "zh" ? `共 ${total} 条留言` : `Total ${total} messages`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={locale === "zh" ? "搜索姓名、邮箱、公司..." : "Search name, email, company..."}
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === "" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setStatusFilter("");
                        setCurrentPage(1);
                      }}
                    >
                      {locale === "zh" ? "全部" : "All"}
                    </Button>
                    <Button
                      variant={statusFilter === "PENDING" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setStatusFilter("PENDING");
                        setCurrentPage(1);
                      }}
                    >
                      {locale === "zh" ? "待处理" : "Pending"}
                    </Button>
                    <Button
                      variant={statusFilter === "REPLIED" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setStatusFilter("REPLIED");
                        setCurrentPage(1);
                      }}
                    >
                      {locale === "zh" ? "已回复" : "Replied"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts List */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{locale === "zh" ? "暂无留言" : "No messages"}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <Card
                      key={contact.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedContact?.id === contact.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleViewContact(contact)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                              {getStatusBadge(contact.status)}
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{contact.subject}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </span>
                              {contact.company && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {contact.company}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(contact.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      {locale === "zh" ? "上一页" : "Previous"}
                    </Button>
                    <div className="flex items-center px-4">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      {locale === "zh" ? "下一页" : "Next"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Contact Detail */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              {selectedContact ? (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{locale === "zh" ? "留言详情" : "Message Detail"}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedContact(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{selectedContact.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${selectedContact.email}`} className="hover:text-primary">
                            {selectedContact.email}
                          </a>
                        </div>
                        {selectedContact.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${selectedContact.phone}`} className="hover:text-primary">
                              {selectedContact.phone}
                            </a>
                          </div>
                        )}
                        {selectedContact.company && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            {selectedContact.company}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{locale === "zh" ? "主题" : "Subject"}</h5>
                      <p className="text-sm text-gray-700">{selectedContact.subject}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{locale === "zh" ? "留言内容" : "Message"}</h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{locale === "zh" ? "状态" : "Status"}</h5>
                      <div className="flex gap-2 flex-wrap">
                        {(["PENDING", "REPLIED", "RESOLVED", "ARCHIVED"] as const).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={selectedContact.status === status ? "default" : "outline"}
                            onClick={() => handleUpdateStatus(selectedContact.id, status)}
                          >
                            {status === "PENDING" && (locale === "zh" ? "待处理" : "Pending")}
                            {status === "REPLIED" && (locale === "zh" ? "已回复" : "Replied")}
                            {status === "RESOLVED" && (locale === "zh" ? "已解决" : "Resolved")}
                            {status === "ARCHIVED" && (locale === "zh" ? "已归档" : "Archived")}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{locale === "zh" ? "备注" : "Notes"}</h5>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={locale === "zh" ? "添加备注..." : "Add notes..."}
                        rows={4}
                      />
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={handleSaveNotes}
                        disabled={saving}
                      >
                        {saving ? (locale === "zh" ? "保存中..." : "Saving...") : (locale === "zh" ? "保存备注" : "Save Notes")}
                      </Button>
                    </div>

                    <div className="text-xs text-gray-400 border-t pt-4">
                      <div>{locale === "zh" ? "提交时间" : "Submitted"}: {formatDate(selectedContact.createdAt)}</div>
                      <div>{locale === "zh" ? "更新时间" : "Updated"}: {formatDate(selectedContact.updatedAt)}</div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="py-12 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {locale === "zh" ? "选择一条留言查看详情" : "Select a message to view details"}
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
