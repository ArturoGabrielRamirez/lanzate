import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Filter, Search, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import * as motion from "motion/react-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div className="space-y-2 grow flex flex-col">
          {/* Filter/Search and Top Actions Section */}
          <motion.div className="flex items-center py-4 justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <Button variant="outline" size="lg" disabled>
                <Filter className="size-4" />
              </Button>

              {/* Search Input */}
              <div className="relative max-w-sm grow">
                <Input
                  placeholder="Filter..."
                  disabled
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            {/* Top Actions (Create buttons, etc.) */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </motion.div>

          {/* Table Container */}
          <motion.div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Checkbox Column */}
                  <TableHead className="w-12">
                    <Checkbox disabled />
                  </TableHead>

                  {/* ID Column */}
                  <TableHead className="w-20">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-6" />
                    </div>
                  </TableHead>

                  {/* Name/Main Column */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <ArrowUpDown className="size-4 text-muted-foreground" />
                    </div>
                  </TableHead>

                  {/* Status/Badge Column */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <ArrowUpDown className="size-4 text-muted-foreground" />
                    </div>
                  </TableHead>

                  {/* Price/Number Column */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <ArrowUpDown className="size-4 text-muted-foreground" />
                    </div>
                  </TableHead>

                  {/* Date Column */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <ArrowUpDown className="size-4 text-muted-foreground" />
                    </div>
                  </TableHead>

                  {/* Additional Column */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <ArrowUpDown className="size-4 text-muted-foreground" />
                    </div>
                  </TableHead>

                  {/* Actions Column */}
                  <TableHead className="w-16">
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Table Rows with varied content types */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {/* Checkbox */}
                    <TableCell>
                      <Checkbox disabled />
                    </TableCell>

                    {/* ID */}
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>

                    {/* Name/Main content */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32" />
                        {index % 4 === 0 && <Badge variant="secondary" className="opacity-50">Featured</Badge>}
                      </div>
                    </TableCell>

                    {/* Status/Badge */}
                    <TableCell>
                      <Badge variant="outline" className="opacity-70">
                        <Skeleton className="h-3 w-12" />
                      </Badge>
                    </TableCell>

                    {/* Price/Number */}
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>

                    {/* Additional info */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Pagination Section */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-auto"
          >
            <Button variant="outline" disabled>
              <ChevronLeft className="size-4" />
            </Button>

            <Select disabled>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="10" />
              </SelectTrigger>
            </Select>

            <Button variant="outline" disabled>
              <ChevronRight className="size-4" />
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default TableSkeleton